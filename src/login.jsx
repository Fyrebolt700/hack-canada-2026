import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  
  const { loginWithRedirect, logout, isAuthenticated, isLoading } = useAuth0();


  console.log(useAuth0());
    return(
        <div>
          <h1>Login</h1>
          <button
            onClick={() => loginWithRedirect()}
          >Log In</button>
          <button onClick={() => logout()}>Log Out</button>
        </div>
    )
}

export default Login;