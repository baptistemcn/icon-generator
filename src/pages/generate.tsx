import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "~/components/Button";
import { FormGroup } from "~/components/FormGroup";
import { Input } from "~/components/Input";
import { useBuyCredits } from "~/hooks/useBuyCredits";
import { api } from "~/utils/api";

export default function Generate() {
  const { buyCredits } = useBuyCredits();

  const [form, setForm] = useState({
    prompt: "",
  });
  const [imageUrl, setImageUrl] = useState("");

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
      if (!data.imageUrl) return;
      setImageUrl(data.imageUrl);
    },
  });

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    generateIcon.mutate({
      prompt: form.prompt,
    });
  };

  const session = useSession();

  const isLoggedIn = !!session.data;

  return (
    <main className=" flex min-h-screen flex-col items-center justify-center">
      {isLoggedIn ? (
        <div className="flex flex-col gap-4">
          <Button
            onClick={() => {
              signOut().catch(console.error);
            }}
          >
            Log out
          </Button>
          <Button
            onClick={() => {
              buyCredits().catch(console.error);
            }}
          >
            Buy Credits
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => {
            signIn().catch(console.error);
          }}
        >
          Login
        </Button>
      )}

      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight  sm:text-[5rem]">
          Generate
        </h1>
        {isLoggedIn && (
          <div className="flew-row flex items-center gap-2">
            <span>Hello,</span>
            <Image
              src={session.data.user.image!}
              alt={session.data.user.name!}
              className="rounded"
              height={24}
              width={24}
            />
            <span className="text-xl font-bold">{session.data.user.name}</span>
          </div>
        )}
        <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
          <FormGroup>
            <label>Prompt</label>
            <Input
              type="text"
              value={form.prompt}
              onChange={updateForm("prompt")}
            />
          </FormGroup>
          <Button className="rounded bg-blue-400 px-4 py-2 hover:bg-blue-500">
            Generate
          </Button>
        </form>
        {imageUrl && <Image src={imageUrl} width="100" height="100" alt={""} />}
      </div>
    </main>
  );
}
