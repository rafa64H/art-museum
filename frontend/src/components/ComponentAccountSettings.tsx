import React from "react";
import MultipleSelectButton from "./ui/MultipleSelectButton";

function ComponentAccountSettings() {
  return (
    <div>
      <h1>Account Settings</h1>

      <section>
        <MultipleSelectButton
          textBtn="Account information"
          typeButton="button"
          buttonActivated={true}
        ></MultipleSelectButton>
      </section>

      <form></form>
    </div>
  );
}

export default ComponentAccountSettings;
