// controllers/processesController.js

// Assuming you have the database pool defined in a separate file
const { pool } = require('../db');
const multer = require('multer');
const { sendEmailNotification, sendBulkEmailNotifications } = require('../utils/emailNotifications.js');
const { signatureRequired, fromEmail } = require('../config.js');

const createProcess = async (req, res) => {
    const { title, signatories, commentsVisibleTo } = req.body;
    // Ensure the creator is not one of the signatories
    if (signatories.includes(req.user.userId)) {
        return res.status(400).json({ error: 'Process creator must not be one of the signatories' });
    }

    try {
        const client = await pool.connect();

        // Insert the new process into the database
        const insertProcessQuery = 'INSERT INTO processes (title, creator_id, signatories, comments_visible_to) VALUES ($1, $2, $3, $4) RETURNING *';
        const processValues = [title, req.user.userId, signatories, commentsVisibleTo];
        const processResult = await client.query(insertProcessQuery, processValues);
        const newProcess = processResult.rows[0];

        const getSignatoriesResult = await client.query('SELECT email FROM users WHERE id = ANY($1)', [signatories]);
        const getSignatories = getSignatoriesResult.rows;

        for (let i = 0; i < getSignatories.length; i++) {
            const signatoryEmail = getSignatories[i].email;
            console.log(signatoryEmail);
            sendEmailNotification(fromEmail, signatoryEmail, 'New process created', 'A new process has been created which requires your sign off');
        }

        client.release();
        res.status(201).json({ message: 'Process created successfully', process: newProcess });
    } catch (error) {
        console.error('Error creating process:', error);
        res.status(500).json({ error: 'An unexpected error occurred' });
    }
};

const signOffProcess = async (req, res) => {
    const { processId } = req.params;
    const { comment, picture } = req.body;
    try {
        const client = await pool.connect();

        // Check if the user is a signatory of the process
        const processResult = await client.query('SELECT * FROM processes WHERE id = $1 AND $2 = ANY(signatories)', [processId, req.user.userId]);
        if (processResult.rowCount === 0) {
            client.release();
            return res.status(403).json({ error: 'You are not authorized to sign-off on this process' });
        }
        const signatories = processResult.rows[0].signatories

        // Check if the user has already signed the process
        const preSignedUser = await client.query('SELECT id from process_signatures where process_id = $1 AND user_id = $2', [processId, req.user.userId]);
        if (preSignedUser.rowCount != 0) {
            client.release();
            return res.status(409).json({ error: 'You have already signed off this process' });
        }

        // Save the uploaded picture if provided
        let picturePath = null;
        if (picture) {
            const storage = diskStorage({
                destination: (req, file, cb) => {
                    cb(null, 'uploads/');
                },
                filename: (req, file, cb) => {
                    const fileName = Date.now() + '-' + file.originalname;
                    cb(null, fileName);
                },
            });

            const upload = multer({ storage }).single('picture');

            upload(req, res, (err) => {
                if (err) {
                    console.error('Error uploading picture:', err);
                    return res.status(500).json({ error: 'An error occurred while uploading the picture' });
                }

                if (req.file) {
                    picturePath = req.file.path;
                }
            });
        }

        // Insert the signature into the database
        const insertSignatureQuery = 'INSERT INTO process_signatures (process_id, user_id, comment, picture_path) VALUES ($1, $2, $3, $4) RETURNING *';
        const signatureValues = [processId, req.user.userId, comment, picturePath];
        const signatureResult = await client.query(insertSignatureQuery, signatureValues);
        const newSignature = signatureResult.rows[0];

        // Notify creator on each successful sign-off
        const process = processResult.rows[0];
        processCreatorId = process.creator_id;
        getProcessCreatorDetails = await client.query('SELECT email from users where id = $1', [process.creator_id]);
        processCreatorEmail = getProcessCreatorDetails.rows[0].email;

        sendEmailNotification(fromEmail, processCreatorEmail, `User Sign-off for Process ${processId}`,
            `User ${req.user.userId} has signed off for your Process ${processId}`);

        // In case all the signatories have signed off, notify all users involved via mail
        const processSignatures = await client.query('SELECT id from process_signatures where process_id = $1', [processId])
        if (processSignatures.rowCount === signatureRequired) {
            const getSignatoriesResult = await client.query('SELECT email FROM users WHERE id = ANY($1)', [signatories]);
            const getSignatories = getSignatoriesResult.rows;
    
            for (let i = 0; i < getSignatories.length; i++) {
                const signatoryEmail = getSignatories[i].email;
                sendEmailNotification(fromEmail, signatoryEmail, 'All Users Signed off', `All users have signed off for process ${processId}`);
            }
            sendEmailNotification(fromEmail, processCreatorEmail, 'All Users Signed off', `All users have signed off for process ${processId}`);
        }

        client.release();
        res.status(201).json({ message: 'Sign-off successful', signature: newSignature });

    } catch (error) {
        console.error('Error signing off:', error);
        res.status(500).json({ error: 'An unexpected error occurred' });
    }
};

const getProcessDetails = async (req, res) => {
    const { processId } = req.params;
    try {
        const client = await pool.connect();

        // Get the process details
        const processResult = await client.query('SELECT * FROM processes WHERE id = $1', [processId]);
        if (processResult.rowCount === 0) {
            client.release();
            return res.status(404).json({ error: 'Process not found' });
        }

        const process = processResult.rows[0];

        // Check if the user is authorized to view the comments
        if (process.comments_visible_to != null && !process.comments_visible_to.includes(req.user.userId)) {
            return res.status(403).json({ error: 'You are not authorized to view the comments for this process' });
        }

        // Get the signatures for the process
        const signaturesResult = await client.query('SELECT * FROM process_signatures WHERE process_id = $1', [processId]);
        const signatures = signaturesResult.rows;

        client.release();

        res.json({ process, signatures });
    } catch (error) {
        console.error('Error getting process details:', error);
        res.status(500).json({ error: 'An unexpected error occurred' });
    }
};

module.exports = {
    createProcess,
    signOffProcess,
    getProcessDetails,
};
