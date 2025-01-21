type Props = {
  refProp: React.RefObject<HTMLTextAreaElement>;
  width?: string;
  minHeight?: string;
  smallOrLarge: "large" | "small";
  idAndFor: string;
  textLabel?: string;
  placeholder?: string;
};
function InputTextArea({
  refProp,
  width,
  minHeight,
  smallOrLarge,
  idAndFor,
  textLabel,
  placeholder,
}: Props) {
  if (!width) width = "min(45rem,100%)";
  if (!minHeight) minHeight = "10rem";
  return (
    <div
      className={
        smallOrLarge === "large"
          ? `w-[${width}] flex flex-col mb-4 lg:grid lg:grid-cols-3`
          : `flex flex-col justify-start items-start w-[${width}]`
      }
    >
      <label htmlFor={idAndFor}>
        {textLabel ? textLabel : "Write your text"}:
      </label>
      <textarea
        className={`border-2 mt-2 min-h-[${minHeight}] w-full lg:mt-0 lg:col-span-2 border-black resize-none p-2 text-black data-[error-input=true]:border-red-700`}
        id={idAndFor}
        placeholder={placeholder ? placeholder : "Write your text"}
        ref={refProp}
      ></textarea>
    </div>
  );
}

export default InputTextArea;
