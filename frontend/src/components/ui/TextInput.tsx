import React from "react";

type Props = {
  idFor: string;
  label: string;
  type: "text" | "email" | "password";
  placeholder: string;
  refProp: React.Ref<HTMLInputElement>;
};
function TextInput({ idFor, label, type, placeholder, refProp }: Props) {
  return (
    <div className="grid grid-cols-2 w-[min(30rem,50%)]">
      <label className="" htmlFor={idFor}>
        {label}:
      </label>
      <input
        className="p-2 border-2 border-black"
        id={idFor}
        type={type}
        placeholder={placeholder}
        ref={refProp}
      />
    </div>
  );
}

export default TextInput;
