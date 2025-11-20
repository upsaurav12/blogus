import { SignIn, SignUp } from "@clerk/clerk-react";

function Auth() {
  return (
    <>
      <SignIn path="/sign-in" routing="path" />
      <SignUp path="/sign-up" routing="path" />
    </>
  );
}

export default Auth;
