import SessionWrapper from "./components/SessionWrapper";
import AuthUI from "/Users/stevenbaird/Uni Work/Project CS408/Final Programs here/app/pkce-test-app/src/app/components/AuthUI"; // Import the UI component

export default function HomePage() {
  return (
    <SessionWrapper>
        <AuthUI /> {/* Renders interactive login buttons */}
    </SessionWrapper>
  );
}