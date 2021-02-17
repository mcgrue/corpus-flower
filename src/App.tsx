import React from 'react';
import './App.css';
import { AmplifyAuthenticator, AmplifySignOut, AmplifySignUp /*, AmplifySignIn*/ } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';

let config:any = awsconfig;

// if(!config.auth) {
//   config.auth = {};
// }

// if(!config.userPoolId) {
//   config.userPoolId = config.aws_user_pools_id;
//   config.auth.userPoolId = config.aws_user_pools_id;
// }

// if(!config.identityPoolId) {
//   config.identityPoolId = config.aws_cognito_identity_pool_id;
//   config.auth.identityPoolId = config.aws_cognito_identity_pool_id;
// }

// const authPatch = { 
//   Auth: { 
//     identityPoolId: 'us-east-2:c3588282-d951-4126-89a9-35667fd3e7b2', 
//     region: 'us-east-2', 
//     userPoolId: 'us-east-2_YYT7qhEtw', 
//     userPoolWebClientId: '3mfj8c2pf4i13utmlog2324tbr' 
//   } 
// }

Amplify.configure(config);
// Amplify.configure(authPatch);
Auth.configure(config);

const federated = {
  googleClientId: "890151091839-vn62g60e5fsh3d93c8j4d9e6esiru9so"
};

// type AwsUser = {
//   attributes: {};
// };

const AuthStateApp: React.FunctionComponent = () => {
  const [authState, setAuthState] = React.useState<AuthState>();
  const [user, setUser] = React.useState<object | undefined>();

  React.useEffect(() => {
      onAuthUIStateChange((nextAuthState, authData) => {
          setAuthState(nextAuthState);
          setUser(authData);
      });
  }, []);
  
  if( authState === AuthState.SignedIn && user ) {
    return(
        <div className="App">
            <div>Hello, {user ? JSON.stringify(user) : 'None'}!</div>
            <AmplifySignOut />
        </div>
      );
  }
  
  return (
    <AmplifyAuthenticator federated={federated} usernameAlias="email"> 
      <AmplifySignUp
        slot="sign-up"
        usernameAlias="email"
        formFields={[
          {
            type: "email",
            label: "Email",
            placeholder: "",
            required: true,
          },
          {
            type: "password",
            label: "Password",
            placeholder: "",
            required: true,
          }
        ]} />
      
    </AmplifyAuthenticator>
  );
}

export default AuthStateApp;