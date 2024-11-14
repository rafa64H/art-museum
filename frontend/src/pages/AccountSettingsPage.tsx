import Header from "../components/Header";
import ComponentAccountSettings from "../components/ComponentAccountSettings";

function AccountSettingsPage() {
  return (
    <>
      <Header></Header>
      <div className="bg-mainBg text-white">
        <ComponentAccountSettings></ComponentAccountSettings>
      </div>
    </>
  );
}

export default AccountSettingsPage;
