/**
 * @note We will use this code when permit 2 is implemented
 */

// import invariant from 'tiny-invariant'
// import { ethers } from 'ethers'
// import { PermitSingle } from '@uniswap/permit2-sdk'
// import { CommandType, getCommand } from './routerCommands'
// import { ROUTER_AS_RECIPIENT } from './constants'
// import { MultiAction, SingleAction } from './types'

// export interface Permit2Permit extends PermitSingle {
//   signature: string
// }

// export type ApproveProtocol = {
//   token: string
//   protocol: string
// }

// export type Permit2TransferFrom = {
//   token: string
//   amount: string
//   recipient?: string
// }

// export type InputTokenOptions = {
//   approval?: ApproveProtocol
//   permit2Permit?: Permit2Permit
//   permit2TransferFrom?: Permit2TransferFrom
// }

// const SIGNATURE_LENGTH = 65
// const EIP_2098_SIGNATURE_LENGTH = 64

// export function encodePermit(permit2: Permit2Permit): SingleAction {
//   let signature = permit2.signature

//   const length = ethers.utils.arrayify(permit2.signature).length
//   // signature data provided for EIP-1271 may have length different from ECDSA signature
//   if (length === SIGNATURE_LENGTH || length === EIP_2098_SIGNATURE_LENGTH) {
//     // sanitizes signature to cover edge cases of malformed EIP-2098 sigs and v used as recovery id
//     signature = ethers.utils.joinSignature(ethers.utils.splitSignature(permit2.signature))
//   }

//   return getCommand(CommandType.PERMIT2_PERMIT, [permit2, signature])
// }

// // Handles the encoding of commands needed to gather input tokens for a trade
// // Approval: The router approving another address to take tokens.
// //   note: Only seaport and sudoswap support this action. Approvals are left open.
// // Permit: A Permit2 signature-based Permit to allow the router to access a user's tokens
// // Transfer: A Permit2 TransferFrom of tokens from a user to either the router or another address
// export function encodeInputTokenOptions(multiAction: MultiAction, options: InputTokenOptions) {
//   // first ensure that all tokens provided for encoding are the same
//   if (!!options.approval && !!options.permit2Permit)
//     invariant(options.approval.token === options.permit2Permit.details.token, `inconsistent token`)
//   if (!!options.approval && !!options.permit2TransferFrom)
//     invariant(options.approval.token === options.permit2TransferFrom.token, `inconsistent token`)
//   if (!!options.permit2TransferFrom && !!options.permit2Permit)
//     invariant(options.permit2TransferFrom.token === options.permit2Permit.details.token, `inconsistent token`)

//   // if an options.approval is required, add it
//   if (!!options.approval) {
//     multiAction.newAction(getCommand(CommandType.APPROVE_ERC20, [
//       options.approval.token
//     ]))
//   }

//   // if this order has a options.permit2Permit, encode it
//   if (!!options.permit2Permit) {
//     multiAction.newAction(encodePermit(options.permit2Permit));
//   }

//   if (!!options.permit2TransferFrom) {
//     multiAction.newAction(getCommand(CommandType.PERMIT2_TRANSFER_FROM, [
//       options.permit2TransferFrom.token,
//       options.permit2TransferFrom.recipient ? options.permit2TransferFrom.recipient : ROUTER_AS_RECIPIENT,
//       options.permit2TransferFrom.amount,
//     ]))
//   }
// }
