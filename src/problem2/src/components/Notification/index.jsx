import * as Toast from "@radix-ui/react-toast";
import "./styles.css";

export default function Notification({
  open,
  onOpenChange,
  title,
  content,
  type,
}) {
  return (
    <>
      <Toast.Root
        className={`ToastRoot ${type === "success" ? "bg-green-600" : type === "error" ? "bg-red-600" : type === "warning" ? "bg-yellow-600" : "bg-gray-600"}`}
        open={open}
        onOpenChange={onOpenChange}
      >
        <Toast.Title className="ToastTitle">{title}</Toast.Title>
        <Toast.Description className="ToastDescription" asChild>
          <div className="">{content}</div>
        </Toast.Description>
        <Toast.Action className="ToastAction" asChild altText="Dimiss">
          <button className="ToastButton">Dismiss</button>
        </Toast.Action>
      </Toast.Root>
      <Toast.Viewport className="ToastViewport " />
    </>
  );
}
