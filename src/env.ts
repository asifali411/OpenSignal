export function isApp(): boolean {
    return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}