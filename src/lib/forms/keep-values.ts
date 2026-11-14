import { startTransition, type FormEvent } from "react";

// Chris, 2026-11-14: "I don't want it to empty I just want it to refuse the form." A form handed to `action={...}` is cleared by
// React after every submit, so a refused form came back empty and people had to type it all again. These forms submit through
// onSubmit instead: the server still checks every field and refuses with its message, and what was typed stays in the boxes.
export function keepValuesOnSubmit(dispatch: (formData: FormData) => void, before?: (event: FormEvent<HTMLFormElement>) => void) {
  return (event: FormEvent<HTMLFormElement>) => {
    before?.(event);
    if (event.defaultPrevented) return;
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const formData = new FormData(event.currentTarget, submitter instanceof HTMLElement ? submitter : null);
    startTransition(() => dispatch(formData));
  };
}
