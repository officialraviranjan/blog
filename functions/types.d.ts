// Cloudflare Workers HTMLRewriter type declaration for TypeScript
declare class HTMLRewriter {
  on(selector: string, handlers: {
    element?: (element: {
      getAttribute(name: string): string | null;
      setAttribute(name: string, value: string): void;
      removeAttribute(name: string): void;
      setInnerContent(content: string, options?: { html?: boolean }): void;
      append(content: string, options?: { html?: boolean }): void;
      prepend(content: string, options?: { html?: boolean }): void;
      before(content: string, options?: { html?: boolean }): void;
      after(content: string, options?: { html?: boolean }): void;
    }) => void | Promise<void>;
    comments?: (comment: any) => void | Promise<void>;
    text?: (text: any) => void | Promise<void>;
  }): HTMLRewriter;
  transform(response: Response): Response;
}
