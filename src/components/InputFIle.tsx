import { useState } from "react";
import { Input } from "./ui/input";

const InputFile = (props) => {
  const [fileName, setFileName] = useState<string>("");
  return (
    <>
      <label
        htmlFor={props?.id}
        className="flex gap-3 h-10 w-full rounded-md border border-input bg-background px-4 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm cursor-pointer"
      >
        <span className="font-medium">Pilih Berkas</span>
        <span>{fileName || "Tidak ada berkas yang dipilih"}</span>
      </label>
      <Input 
        {...props}
        className="hidden"
        onChange={(e) => {
          setFileName(e.target.files[0]?.name || "");
          props?.onChange?.(e);
        }}
      />
    </>
  );
};

export default InputFile;