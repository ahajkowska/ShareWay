export interface ChecklistItemDto {
    id: string;
    text: string;
    isChecked: boolean; // Personal status for the requesting user
    createdAt?: Date;
}