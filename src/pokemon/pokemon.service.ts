import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
  private default_limit: number;
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService,
  ) {
    this.default_limit = configService.get<number>('default_limit');
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);

      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDTO) {
    const { limit = this.default_limit, offset = 0 } = paginationDto;
    return await this.pokemonModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({ no: 1 })
      .select('-__v');
  }

  async findOne(id: string) {
    let pokemon: Pokemon;
    // Search for ID
    if (!isNaN(+id)) {
      // Lo Convierto en Entero y verifico si es un numero
      pokemon = await this.pokemonModel.findOne({ no: id });
    }

    // Mongo ID
    if (!pokemon && isValidObjectId(id)) {
      pokemon = await this.pokemonModel.findById(id);
    }

    // Find for Name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: id.toLocaleLowerCase().trim(),
      });
    }

    if (!pokemon)
      throw new NotFoundException(
        ` Pokemon with id, name or no "${id}" Not Found`,
      );

    return pokemon;
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(id);

    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    try {
      await pokemon.updateOne(updatePokemonDto);
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // // this.pokemonModel.findByIdAndDelete()
    // await pokemon.deleteOne();
    // const results = await this.pokemonModel.findByIdAndDelete(id);
    const results = await this.pokemonModel.deleteOne({ _id: id });
    const { deletedCount } = results;
    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon with id "${id}" not found`);
    }
    return;
  }

  // Manejo de Elementos Duplicados
  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create Pokemon - Check Server Logs `,
    );
  }
}
