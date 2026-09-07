export type CreateChoicePayload = {
  title: string;
  optionA: string;
  optionB: string;
  optionAImage: File | null;
  optionBImage: File | null;
};

export type CreateChoiceFieldErrors = {
  title?: string;
  optionA?: string;
  optionB?: string;
};

export type VotePayload = {
  choiceId: string;
  option: "A" | "B";
};
