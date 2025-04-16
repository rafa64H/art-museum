type Props = {
  textValue: string;
  conditionError: boolean;
};
function AlertParagraph({ textValue, conditionError }: Props) {
  return (
    <p
      className={`text-xl font-bold ${
        conditionError ? "text-red-400" : "text-blue-400"
      }`}
      role="alert"
      aria-live="assertive"
    >
      {textValue}
    </p>
  );
}

export default AlertParagraph;
