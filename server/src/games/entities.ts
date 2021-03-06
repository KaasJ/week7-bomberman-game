import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, Index, OneToMany, ManyToOne } from 'typeorm';
import User from '../users/entity';
import {defaultBoard} from './boards';

export type PlayerSymbol = 'x' | 'o' | '☆' | 'ᗣ';
export type ObstacleSymbol = '▩' | '□' | '▣';
export type ExplosionSymbol = '-' | '|' | '>' | '<' | '^' | 'v';
export type PowerupSymbol = 'db^' | 'dbv' | 'df^' | 'dfv' | 'null';
export type Symbol = PlayerSymbol | ObstacleSymbol | ExplosionSymbol | PowerupSymbol | '💣' | '@';
export type Row = (Symbol | null)[];
export type Board = Row[];
export type Position = [ number, number ];
export interface ExplosionPos {
  '+': Position[],
  '-': Position[],
  '|': Position[],
  '>': Position[],
  '<': Position[],
  '^': Position[],
  'v': Position[],
}
export type PlayerFacing = '>' | '<' | '^' | 'v';
export interface PlayerStats {
  power: number;
  bombs: number;
  speed: number;
}
export type FlamePos = [number, number];

type Status = 'pending' | 'started' | 'finished';

@Entity()
export class Game extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @Column('json', {default: defaultBoard})
  board: Board

  @Column('char', {length:1, nullable: true})
  winner: Symbol

  @Column('text', {default: 'pending'})
  status: Status

  @OneToMany(_ => Player, player => player.game, {eager:true})
  players: Player[]

  @OneToMany(_ => Bomb, bomb => bomb.game, {eager:true})
  activeBombs: Bomb[]

  @OneToMany(_ => Explosion, explosion => explosion.game, {eager:true})
  activeExplosions: Explosion[]

  @OneToMany(_ => Flame, flame => flame.game, {eager:true})
  activeFlames: Flame[]
}

@Entity()
@Index(['game', 'user', 'symbol'], {unique:true})
export class Player extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @ManyToOne(_ => User, user => user.players)
  user: User

  @ManyToOne(_ => Game, game => game.players)
  game: Game

  @Column()
  userId: number

  @Column('char', {length: 1})
  symbol: PlayerSymbol

  @Column('json', {default: [0,0]})
  position: Position

  @Column('char', {length: 1, default: 'v'})
  facing: PlayerFacing

  @Column('boolean', {default: false})
  dead: boolean

  @Column('json', {default: {power: 1, bombs: 1, speed: 3}})
  stats: PlayerStats

  @Column('int', {default: 0})
  activeBombs: number
}

@Entity()
export class Bomb extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @ManyToOne(_ => Game, game => game.activeBombs)
  game: Game 

  @Column('json', {default: [0,0]})
  position: Position

  @Column('int', {default: 2})
  power: number
}

@Entity()
export class Explosion extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number

  @ManyToOne(_ => Game, game => game.activeExplosions)
  game: Game 

  @Column('json', {default: [0,0]})
  position: ExplosionPos
}

@Entity()
export class Flame extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number

  @ManyToOne(_ => Game, game => game.activeFlames)
  game: Game

  @Column('json', {default: [0,0]})
  position: FlamePos
}