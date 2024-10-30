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
    <div className="flex w-[min(50rem,60%)] flex-col lg:grid lg:grid-cols-2">
      <label className="lg:ml-auto" htmlFor={idFor}>
        {label}:
      </label>
      <input
        className="border-2 border-black p-2 text-black"
        id={idFor}
        type={type}
        placeholder={placeholder}
        ref={refProp}
      />
    </div>
  );
}

export default TextInput;
