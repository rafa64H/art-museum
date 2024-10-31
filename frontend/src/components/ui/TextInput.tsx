import React from "react";

type Props = {
  idFor: string;
  label: string;
  type: "text" | "email" | "password";
  placeholder: string;
  refProp: React.Ref<HTMLInputElement>;
  additionalFunction?: () => void;
};
function TextInput({
  idFor,
  label,
  type,
  placeholder,
  refProp,
  additionalFunction,
}: Props) {
  return (
    <div className="flex w-[min(50rem,60%)] flex-col lg:grid lg:grid-cols-2">
      <label className="lg:ml-auto" htmlFor={idFor}>
        {label}:
      </label>
      <input
        className="border-2 border-black p-2 text-black data-[error-input=true]:border-red-700"
        id={idFor}
        type={type}
        placeholder={placeholder}
        ref={refProp}
        onClick={(e) => {
          const target = e.target as HTMLInputElement;

          target.setAttribute("data-error-input", "false");
          if (additionalFunction) additionalFunction();
        }}
        data-error-input="false"
      />
    </div>
  );
}

export default TextInput;
