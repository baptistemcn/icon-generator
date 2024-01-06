import { useState, type ChangeEvent, type FormEvent } from "react";
import { FormGroup } from "~/components/FormGroup";
import { Input } from "~/components/Input";
import { api } from "~/utils/api";

export default function Generate() {
  const [form, setForm] = useState({
    prompt: "",
  });

  const updateForm = (key: string) => {
    return function (e: ChangeEvent<HTMLInputElement>) {
      setForm((prev) => ({
        ...prev,
        [key]: e.target.value,
      }));
    };
  };

  const generateIcon = api.generate.generatIcon.useMutation({
    onSuccess(data) {
      console.log("mutation finished", data);
    },
  });

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    generateIcon.mutate({
      prompt: form.prompt,
    });
  };

  return (
    <main className=" flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight  sm:text-[5rem]">
          Generate
        </h1>
        <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
          <FormGroup>
            <label>Prompt</label>
            <Input
              type="text"
              value={form.prompt}
              onChange={updateForm("prompt")}
            />
          </FormGroup>
          <button className="rounded bg-blue-400 px-4 py-2 hover:bg-blue-500">
            Generate
          </button>
        </form>
      </div>
    </main>
  );
}
