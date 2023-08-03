# multisig_App
Backend Engineering: Multisig Assignment
 1.  Postgres Database and Login:
 
 - Create a PostgresSQL database to store user information such as name
 and email.
 - Develop a login system that allows users to sign up and assigns them an
 internal login ID.

 2. Multisignature Process:
 - Develop a multi-signature process where a user can create a process that
 requires sign-offs from five other users.
 - Allow the user to choose the five other users from a dropdown list and
 send email notifications to each user when a new process is created.
 - Add the functionality for users to add comments and upload a mandatory
 picture during the sign-off process.
 - Allow the process creator to select which users can see the comments.
 - Ensure the process creator receives a notification on their page when
 anyone signs off, and notify all parties involved via email when everyone
 signs off.
 - The same Postgres db can be used for this process as well.
 
 3.  API:
 - Break down the multi-signature process into REST APIs.
 - Ensure that the APIs can be integrated into any webpage