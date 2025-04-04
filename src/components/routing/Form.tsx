import { FormEvent, FormHTMLAttributes, ReactNode } from "react";

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
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
  ...rest
}: FormProps) => {
  return (
    <form action={action} method={method} onSubmit={handleSubmit} {...rest}>
      {children}
    </form>
  );
};
