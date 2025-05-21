export interface DomainMappingJoinDto {
    firstDomain: string;
    firstId: number;
    secondDomain: string;
    secondId: number;
}

export interface DomainMappingJoinMultiDto {
    firstDomain: string;
    firstId: number;
    secondDomain: string;
    secondIds: number[];
}