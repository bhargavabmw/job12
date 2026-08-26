const { body, validationResult } = require('express-validator');
const apps = require('../models/applicationModel');
const jobs = require('../models/jobModel');
const resumes = require('../models/resumeModel');
const statuses = ['Applied', 'Under Review', 'Shortlisted', 'Rejected', 'Selected'];

exports.apply = async (req, res, next) => {
	try {
		const result = validationResult(req);
		if (!result.isEmpty()) return res.status(422).json({ message: 'Validation failed', errors: result.array() });
		const { job_id: jobId, resume_id: resumeId } = req.body;
		if (!await jobs.byId(jobId)) return res.status(404).json({ message: 'Job not found' });
		if (!await resumes.byId(resumeId, req.user.id)) return res.status(400).json({ message: 'Select one of your resumes' });
		if (await apps.exists(jobId, req.user.id)) return res.status(409).json({ message: 'You have already applied to this job' });
		try {
			await apps.create(jobId, req.user.id, resumeId);
		} catch (error) {
			if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'You have already applied to this job' });
			throw error;
		}
		res.status(201).json({ message: 'Application submitted' });
	} catch (error) { next(error); }
};
exports.mine = async (req, res, next) => { try { res.json(await apps.mine(req.user.id)); } catch (error) { next(error); } };
exports.byJob = async (req, res, next) => { try { res.json(await apps.byJob(req.params.jobId, req.user.id)); } catch (error) { next(error); } };
exports.all = async (req, res, next) => { try { res.json(await apps.forRecruiter(req.user.id)); } catch (error) { next(error); } };
exports.status = async (req, res, next) => {
	try {
		const result = validationResult(req);
		if (!result.isEmpty()) return res.status(422).json({ message: 'Validation failed', errors: result.array() });
		if (!await apps.owned(req.params.id, req.user.id)) return res.status(404).json({ message: 'Application not found' });
		await apps.status(req.params.id, req.body.status);
		res.json({ message: 'Status updated' });
	} catch (error) { next(error); }
};
exports.applyValidate = [body('job_id').isInt({ min: 1 }), body('resume_id').isInt({ min: 1 })];
exports.statusValidate = [body('status').isIn(statuses)];
