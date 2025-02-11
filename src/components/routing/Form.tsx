import { FormEvent, ReactNode } from "react";

interface FormProps {
  action: string;
  method?: string;
  children?: ReactNode;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export const Form = ({
  action,
  method = "GET",
  children,
  handleSubmit,
}: FormProps) => {
  return (
    <form action={action} method={method} onSubmit={handleSubmit}>
      {children}
    </form>
  );
};
