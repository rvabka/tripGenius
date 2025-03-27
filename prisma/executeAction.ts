import { isRedirectError } from 'next/dist/client/components/redirect-error';

type Options<T> = {
  actionFn: () => Promise<T>;
  successMessage?: string;
};

const executeAction = async <T>({
  actionFn,
  successMessage = 'The action was successful'
}: Options<T>): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: T;
}> => {
  try {
    const data = await actionFn();

    return {
      success: true,
      message: successMessage,
      data
    };
  } catch (error) {
    // Obsługa przekierowań
    if (isRedirectError(error)) {
      throw error;
    }

    // Logowanie błędu z pełnymi szczegółami
    console.error('Execute action error:', error);

    // Zwracamy oryginalny błąd zamiast generycznego
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';

    return {
      success: false,
      message: errorMessage,
      error: errorMessage
    };
  }
};

export { executeAction };
