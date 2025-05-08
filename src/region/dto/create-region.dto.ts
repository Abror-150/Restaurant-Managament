import { ApiProperty } from "@nestjs/swagger";

export class CreateRegionDto {
    @ApiProperty({example: "Yer"})
    name: string
}
