export interface ActivityDto {
    id: string;
    dayId: string;
    title: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    location?: string;
    createdBy: string;
    createdByName?: string;
}

export interface DayDto {
    id: string;
    tripId: string;
    date: string;
    activities: ActivityDto[];
    createdAt?: string;
}

export interface CreateDayDto {
    date: string;
}

export interface CreateActivityDto {
    title: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    location?: string;
}

export interface UpdateActivityDto {
    title?: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    location?: string;
}