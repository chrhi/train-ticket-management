"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signinSchema } from "@/lib/validators/auth";
import { PasswordInput } from "../password-input";

export function SigninForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: login, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof signinSchema>) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to sign in");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Signed in successfully");
      router.push("/admin");
      router.refresh(); // Refresh the page to update server components with new auth state
    },
    onError: (error) => {
      toast.error(error.message || "Failed to sign in");

      form.resetField("password");
    },
  });

  function onSubmit(values: z.infer<typeof signinSchema>) {
    login(values);
  }

  return (
    <div className="w-full md:w-96 h-fit bg-white flex flex-col gap-y-4 p-4 border rounded-lg shadow">
      <p className="text-primary text-xl font-semibold">Admin access</p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full h-fit min-h-full"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="enter your email here" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="enter your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full my-8"
            size={"lg"}
            disabled={isPending}
          >
            {isPending ? "Signing in..." : "Login"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
