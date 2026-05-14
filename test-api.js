(async () => {
  try {
    const baseURL = 'http://localhost:5001/api';
    let cookie;
    
    try {
      const regRes = await fetch(`${baseURL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: "Admin", email: "admin2@test.com", password: "password", role: "admin" })
      });
      if (!regRes.ok) throw new Error("Registration failed");
      cookie = regRes.headers.get('set-cookie');
      console.log("Registered Admin");
    } catch(err) {
      const loginRes = await fetch(`${baseURL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: "admin2@test.com", password: "password" })
      });
      if (!loginRes.ok) {
         console.error("Login failed", await loginRes.text());
         return;
      }
      cookie = loginRes.headers.get('set-cookie');
      console.log("Logged in Admin");
    }
    
    const usersRes = await fetch(`${baseURL}/users`, {
      headers: { Cookie: cookie }
    });
    
    if (!usersRes.ok) {
        console.error("Users 500 error:", usersRes.status, await usersRes.text());
    } else {
        const users = await usersRes.json();
        console.log("Users", users.length);
    }
  } catch(e) {
    console.error("ERROR", e.message);
  }
})();
