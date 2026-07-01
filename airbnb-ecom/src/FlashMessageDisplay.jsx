import { useFlashMessage } from "./FlashMessageStore";

export default function FlashMessageDisplay() {
    const { flashMessage } = useFlashMessage();

    return (
        <>
            {flashMessage.message && (
                <div className={`alert alert-${flashMessage.type} flash-fixed`}>
                    {flashMessage.message}
                </div>
            )}
        </>
    );
}
