const fetch = global.fetch;

(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'rahul', email: 'rohit.bamrara@xenelsoft.co.in', password: '123anik' })
    });
    const body = await res.json();
    console.log('STATUS:', res.status);
    console.log('RESPONSE:', JSON.stringify(body, null, 2));
  } catch (err) {
    console.error('ERROR:', err);
  }
})();