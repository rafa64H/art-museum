export default function checkEmptyFieldsForm(
  allRefsCurrentToCheck: HTMLInputElement[],
  setAlertMessage: React.Dispatch<React.SetStateAction<string>>
): boolean {
  const arrayEmptyStringInputs = allRefsCurrentToCheck.filter(
    (refCurrent) => refCurrent!.value === ""
  );

  if (arrayEmptyStringInputs.length) {
    const emptyInputsForAlertMessage: string[] = [];

    arrayEmptyStringInputs.map((refCurrent: HTMLInputElement) => {
      emptyInputsForAlertMessage.push(
        ` ${refCurrent!.id
          .replace(/([a-z])([A-Z])/g, "$1 $2")
          .toLocaleLowerCase()}`
      ); //Make the id of the ref.current from camelCase to spaces
      refCurrent!.setAttribute("data-error-input", "true");
    });

    setAlertMessage(
      `Please fill in all fields: ${[...emptyInputsForAlertMessage]}`
    );
    return false;
  }
  return true;
}
