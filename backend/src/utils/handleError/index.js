module.exports = function handleError(res, req, error) {
  const code = error.code || 500;
  const messageKey = error.messageKey || 'message:server_error';
  res.status(code).json({ message: req.t(messageKey) });
};
