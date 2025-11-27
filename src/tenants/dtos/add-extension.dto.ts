import { IsBoolean, IsInt, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExtensionDto {
  @IsString()
  @ApiProperty({ description: 'Extension number', example: '201' })
  number!: string;

  @IsString()
  @ApiProperty({
    description: 'Strong password for the extension',
    example: 'ixc2fq~4JEQzeX6py?dggy61sI|Hj0Zyo1MI',
  })
  password!: string;

  @IsString()
  @ApiProperty({
    description: 'Transport name (from pjsip.conf)',
    default: 'transport-udp',
    required: true,
    example: 'transport-udp',
  })
  transport: string = 'transport-udp';

  @IsString()
  @ApiProperty({
    description: 'Disallow codecs',
    default: 'all',
    required: false,
    example: 'all',
  })
  disallow: string = 'all';

  @IsString()
  @ApiProperty({
    description: 'Allow codecs',
    default: 'ulaw,alaw',
    required: false,
    example: 'ulaw,alaw',
  })
  allow: string = 'ulaw,alaw';

  @IsInt()
  @Min(1)
  @ApiProperty({
    description: 'Max contacts for AOR',
    default: 1,
    required: false,
    example: 1,
  })
  maxContacts: number = 1;

  @IsBoolean()
  @ApiProperty({
    description: 'Remove existing contacts on re-register',
    default: true,
    required: false,
    example: true,
  })
  removeExisting: boolean = true;
}
