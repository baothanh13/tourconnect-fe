exports.register = (req, res) => {
  const { email, password } = req.body;
  console.log(`Registering user: ${email}`);
  res.json({ message: 'Register successful!' });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@example.com' && password === 'admin') {
    res.json({ message: 'Login successful!' });
  } else {
    res.status(401).json({ message: 'Invalid credentials!' });
  }
};
