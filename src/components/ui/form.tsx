// src/components/ui/form.tsx
import * as React from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { cn } from "../../lib/utils";
import { Label } from "./label";

const Form = React.forwardRef<
  HTMLFormElement,
  React.FormHTMLAttributes<HTMLFormElement>
>(({ className, ...props }, ref) => (
  <form ref={ref} className={cn("space-y-6", className)} {...props} />
));
Form.displayName = "Form";

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-2", className)} {...props} />
));
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <Label ref={ref} className={cn(className)} {...props} />
));
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => <div ref={ref} {...props} />);
FormControl.displayName = "FormControl";

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  if (!children) return null;

  return (
    <p
      ref={ref}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {children}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

interface FormFieldProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  render: (props: {
    field: {
      onChange: (...event: any[]) => void;
      onBlur: () => void;
      value: any;
      name: string;
      ref: React.Ref<any>;
    };
    fieldState: {
      invalid: boolean;
      isTouched: boolean;
      isDirty: boolean;
      error?: {
        message?: string;
      };
    };
  }) => React.ReactElement;
}

const FormField = <TFieldValues extends FieldValues>({
  name,
  control,
  render,
}: FormFieldProps<TFieldValues>): React.ReactElement => {
  return (
    <Controller
      name={name}
      control={control}
      render={(props) => render(props)}
    />
  );
};

export { Form, FormItem, FormLabel, FormControl, FormMessage, FormField };
