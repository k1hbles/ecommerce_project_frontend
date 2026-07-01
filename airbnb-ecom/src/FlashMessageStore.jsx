import { atom, useAtom } from "jotai";

export const flashMessageAtom = atom({
    message: "",
    type: "info"
});

export const useFlashMessage = () => {
    const [flashMessage, setFlashMessage] = useAtom(flashMessageAtom);

    const showMessage = (message, type = "info") => {
        setFlashMessage({ message: message, type: type });
        setTimeout(() => {
            clearMessage();
        }, 4000);
    };

    const clearMessage = () => {
        setFlashMessage({ message: "", type: "info" });
    };

    return { flashMessage, showMessage, clearMessage };
};

