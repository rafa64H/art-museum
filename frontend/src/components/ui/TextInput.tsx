import React from "react";

type Props = {
  idFor: string;
  label: string;
  type: "text" | "email" | "password";
  placeholder: string;
  refProp: React.Ref<HTMLInputElement>;
  defaultValueProp?: string;
  disabledProp?: boolean;
  maxLengthProp?: number;
  additionalFunction?: () => void;
};
function TextInput({
  idFor,
  label,
  type,
  placeholder,
  refProp,
  defaultValueProp,
  disabledProp,
  maxLengthProp,
  additionalFunction,
}: Props) {
  return (
    <div className="w-[min(45rem,100%)] flex flex-col mb-4 lg:grid lg:grid-cols-3">
      <label className="" htmlFor={idFor}>
        {label}:
      </label>
      <input
        className="border-2 mt-2 lg:mt-0 lg:col-span-2 border-black p-2 text-black data-[error-input=true]:border-red-700"
        id={idFor}
        type={type}
        placeholder={placeholder}
        ref={refProp}
        disabled={disabledProp !== null ? disabledProp : false}
        defaultValue={defaultValueProp}
        maxLength={maxLengthProp ? maxLengthProp : undefined}
        onFocus={(e) => {
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
