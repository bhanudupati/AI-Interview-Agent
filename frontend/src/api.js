import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
});

// Start a new interview session
export const startInterview = (role, level) =>
  api.post('/start-interview', { role, level }).then(r => r.data);

// Submit the user's answer for evaluation
export const submitAnswer = (answer) =>
  api.post('/submit-answer', { answer }).then(r => r.data);

// Request the next question
export const nextQuestion = () =>
  api.post('/next-question').then(r => r.data);

// Upload resume and get questions
export const uploadResume = (file) => {
  const form = new FormData();
  form.append('file', file);
  return api.post('/upload-resume', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data);
};

// Generate Leetcode questions from resume
export const generateLeetcode = (file) => {
  const form = new FormData();
  form.append('file', file);
  return api.post('/generate-leetcode', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data);
};

export default api;