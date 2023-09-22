import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'
import { JwtPayload } from './jwt-payload.interface'
import * as bcrypt from 'bcrypt'
import { AuthCredentialsDto } from './dto/auth-credentials.dto'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(payload: JwtPayload): Promise<any> {
    const user = await this.userService.findByUsername(payload.username)
    if (!user) {
      throw new UnauthorizedException()
    }
    return user
  }

  async signIn(
    username: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.userService.findByUsername(username)

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username: user.username }
      const accessToken = this.jwtService.sign(payload)
      return { accessToken }
    } else {
      throw new UnauthorizedException('Invalid credentials')
    }
  }

  async signUp(
    username: AuthCredentialsDto['username'],
    password: AuthCredentialsDto['password'],
  ): Promise<void> {
    // const salt = await bcrypt.genSalt()
    // const hashedPassword = await bcrypt.hash(password, salt)

    return this.userService.createUser(username, password)
  }
}
