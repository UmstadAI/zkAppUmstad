export const deprecatedCodeRules = [
    {
        "comment": "Overriding the constructor of a SmartContract is disallowed. Please remove the constructor.",
        "code": "constructor()"
    },
    {
        "comment": "A Smart Contract can only have 8 allowed storage fields.",
        "code": ""
    },
    {
        "comment": "A `if` statement should not be used in a circuit. Please use `Circuit.if` instead.",
        "code": "if"
    },
    {
        "comment": "JavaScript JSON function usage should be avoided in a circuit. The resulting values do not make it into the circuit.",
        "code": "JSON."
    },
    {
        "comment": "JavaScript randomness usage should be avoided in a circuit. The randomness cannot be verified and thus should not be included in a circuit",
        "code": "Math.random()"
    },
    {
        "comment": "A `ternary` statement should not be used in a circuit. Please use `Circuit.if` instead.",
        "code": "x ? y : z"
    },
    {
        "comment": "A `throw` statement should not be used in a circuit.",
        "code": "throw"
    },
    {
        "comment": "/** @deprecated `ZkProgram` has moved out of the Experimental namespace and is now directly available as a top-level import `ZkProgram`.\n   * The old `Experimental.ZkProgram` API has been deprecated in favor of the new `ZkProgram` top-level import.\n   */",
        "code": "export let ZkProgram = ExperimentalZkProgram"
    },
    {
        "comment": "/**\n * @deprecated `await isReady` is no longer needed. Remove it from your code.\n */",
        "code": "let isReady = Promise.resolve()"
    },
    {
        "comment": "/**\n * @deprecated `shutdown()` is no longer needed, and is a no-op. Remove it from your code.\n */",
        "code": "function shutdown()"
    },
    {
        "comment": "/**\n   * @deprecated use `this.state.getAndRequireEquals()` which is equivalent\n   */",
        "code": "getAndAssertEquals(): A"
    },
    {
        "comment": "/**\n   * @deprecated use `this.state.requireEquals()` which is equivalent\n   */",
        "code": "assertEquals(a: A): void"
    },
    {
        "comment": "/**\n   * @deprecated use `this.state.requireNothing()` which is equivalent\n   */",
        "code": "assertNothing(): void"
    },
    {
        "comment": "/**\n   * @deprecated Use {@link lessThanOrEqual} instead.\n   *\n   * Checks if a {@link UInt64} is less than or equal to another one.\n   */",
        "code": "lte(y: UInt64)"
    },
    {
        "comment": "/**\n   * @deprecated Use {@link assertLessThanOrEqual} instead.\n   *\n   * Asserts that a {@link UInt64} is less than or equal to another one.\n   */",
        "code": "assertLte(y: UInt64, message?: string)"
    },
    {
        "comment": "/**\n   * @deprecated Use {@link lessThan} instead.\n   *\n   * Checks if a {@link UInt64} is less than another one.\n   */",
        "code": "lt(y: UInt64)"
    },
    {
        "comment": "/**\n   *\n   * @deprecated Use {@link assertLessThan} instead.\n   *\n   * Asserts that a {@link UInt64} is less than another one.\n   */",
        "code": "assertLt(y: UInt64, message?: string)"
    },
    {
        "comment": "/**\n   * @deprecated Use {@link greaterThan} instead.\n   *\n   * Checks if a {@link UInt64} is greater than another one.\n   */",
        "code": "gt(y: UInt64)"
    },
    {
        "comment": "/**\n   * @deprecated Use {@link assertGreaterThan} instead.\n   *\n   * Asserts that a {@link UInt64} is greater than another one.\n   */",
        "code": "assertGt(y: UInt64, message?: string)"
    },
    {
        "comment": "/**\n   * @deprecated Use {@link greaterThanOrEqual} instead.\n   *\n   * Checks if a {@link UInt64} is greater than or equal to another one.\n   */",
        "code": "gte(y: UInt64)"
    },
    {
        "comment": "/**\n   * @deprecated Use {@link assertGreaterThanOrEqual} instead.\n   *\n   * Asserts that a {@link UInt64} is greater than or equal to another one.\n   */",
        "code": "assertGte(y: UInt64, message?: string)"
    },
    {
        "comment": "/**\n   * @deprecated Use {@link lessThanOrEqual} instead.\n   *\n   * Checks if a {@link UInt32} is less than or equal to another one.\n   */",
        "code": "lte(y: UInt32)"
    },
    {
        "comment": "/**\n   * @deprecated Use {@link assertLessThanOrEqual} instead.\n   *\n   * Asserts that a {@link UInt32} is less than or equal to another one.\n   */",
        "code": "assertLte(y: UInt32, message?: string)"
    },
    {
        "comment": "/**\n   * @deprecated Use {@link lessThan} instead.\n   *\n   * Checks if a {@link UInt32} is less than another one.\n   */",
        "code": "lt(y: UInt32)"
    },
    {
        "comment": "/**\n   * @deprecated Use {@link assertLessThan} instead.\n   *\n   * Asserts that a {@link UInt32} is less than another one.\n   */",
        "code": "assertLt(y: UInt32, message?: string)"
    },
    {
        "comment": "/**\n   * @deprecated Use {@link greaterThan} instead.\n   *\n   * Checks if a {@link UInt32} is greater than another one.\n   */",
        "code": "gt(y: UInt32)"
    },
    {
        "comment": "/**\n   * @deprecated Use {@link assertGreaterThan} instead.\n   *\n   * Asserts that a {@link UInt32} is greater than another one.\n   */",
        "code": "assertGt(y: UInt32, message?: string)"
    },
    {
        "comment": "/**\n   * @deprecated Use {@link greaterThanOrEqual} instead.\n   *\n   * Checks if a {@link UInt32} is greater than or equal to another one.\n   */",
        "code": "gte(y: UInt32)"
    },
    {
        "comment": "/**\n   * @deprecated Use {@link assertGreaterThanOrEqual} instead.\n\n   * \n   * Asserts that a {@link UInt32} is greater than or equal to another one.\n   */",
        "code": "assertGte(y: UInt32, message?: string)"
    },
    {
        "comment": "/**\n * @deprecated `CircuitValue` is deprecated in favor of {@link Struct}, which features a simpler API and better typing.\n */",
        "code": "abstract class CircuitValue"
    },
    {
        "comment": "/**\n   * @deprecated `this.sign()` is deprecated in favor of `this.requireSignature()`\n   */",
        "code": "sign(zkappKey?: PrivateKey)"
    },
    {
        "comment": "/**\n   * Approve an account update or callback. This will include the account update in the zkApp's public input,\n   * which means it allows you to read and use its content in a proof, make assertions about it, and modify it.\n   *\n   * If this is called with a callback as the first parameter, it will first extract the account update produced by that callback.\n   * The extracted account update is returned.\n   *\n   * ```ts\n   * \\@method myApprovingMethod(callback: Callback) {\n   *   let approvedUpdate = this.approve(callback);\n   * }\n   * ```\n   *\n   * Under the hood, \"approving\" just means that the account update is made a child of the zkApp in the\n   * tree of account updates that forms the transaction.\n   * The second parameter `layout` allows you to also make assertions about the approved update's _own_ children,\n   * by specifying a certain expected layout of children. See {@link AccountUpdate.Layout}.\n   *\n   * @param updateOrCallback\n   * @param layout\n   * @returns The account update that was approved (needed when passing in a Callback)\n   */\n  approve(\n    updateOrCallback: AccountUpdate | Callback<any>,\n    layout?: AccountUpdatesLayout\n  ) {\n    let accountUpdate =\n      updateOrCallback instanceof AccountUpdate\n        ? updateOrCallback\n        : Provable.witness(AccountUpdate, () => updateOrCallback.accountUpdate);\n    this.self.approve(accountUpdate, layout);\n    return accountUpdate;\n  }\n\n  send(args: {\n    to: PublicKey | AccountUpdate | SmartContract;\n    amount: number | bigint | UInt64;\n  }) {\n    return this.self.send(args);\n  }\n\n  /**\n   * @deprecated use `this.account.tokenSymbol`\n   */",
        "code": "get tokenSymbol()"
    },
    {
        "comment": "/**\n   * @deprecated use `this.account.<field>.set()`\n   */",
        "code": "setValue<T>(maybeValue: SetOrKeep<T>, value: T)"
    },
    {
        "comment": "/**\n   * @deprecated use `this.account.permissions.set()`\n   */",
        "code": "setPermissions(permissions: Permissions)"
    },
    {
        "comment": "/**\n   * Coerces two x and y coordinates into a {@link Group} element.\n   */\n  static from(\n    x: FieldVar | Field | number | string | bigint,\n    y: FieldVar | Field | number | string | bigint\n  ) {\n    return new Group({ x, y });\n  }\n\n  /**\n   * @deprecated Please use the method `.add` on the instance instead\n   *\n   * Adds a {@link Group} element to another one.\n   */",
        "code": "static add(g1: Group, g2: Group)"
    },
    {
        "comment": "/**\n   * @deprecated Please use the method `.sub` on the instance instead\n   *\n   * Subtracts a {@link Group} element from another one.\n   */",
        "code": "static sub(g1: Group, g2: Group)"
    },
    {
        "comment": "/**\n   * @deprecated Please use the method `.neg` on the instance instead\n   *\n   * Negates a {@link Group} element. Under the hood, it simply negates the `y` coordinate and leaves the `x` coordinate as is.\n   *\n   * ```typescript\n   * let gNeg = Group.neg(g);\n   * ```\n   */",
        "code": "static neg(g: Group)"
    },
    {
        "comment": "/**\n   * @deprecated Please use the method `.scale` on the instance instead\n   *\n   * Elliptic curve scalar multiplication. Scales a {@link Group} element `n`-times by itself, where `n` is the {@link Scalar}.\n   *\n   * ```typescript\n   * let s = Scalar(5);\n   * let 5g = Group.scale(g, s);\n   * ```\n   */",
        "code": "static scale(g: Group, s: Scalar)"
    },
    {
        "comment": "/**\n   * @deprecated Please use the method `.assertEqual` on the instance instead.\n   *\n   * Assert that two {@link Group} elements are equal to another.\n   * Throws an error if the assertion fails.\n   *\n   * ```ts\n   * Group.assertEquals(g1, g2);\n   * ```\n   */",
        "code": "static assertEqual(g1: Group, g2: Group)"
    },
    {
        "comment": "/**\n   * @deprecated Please use the method `.equals` on the instance instead.\n   *\n   * Checks if a {@link Group} element is equal to another {@link Group} element.\n   * Returns a {@link Bool}.\n   *\n   * ```ts\n   * Group.equal(g1, g2); // Bool(true)\n   * ```\n   */",
        "code": "static equal(g1: Group, g2: Group)"
    },
    {
        "comment": "/**\n   * Calculates a root depending on the leaf value.\n   * @deprecated This is a less efficient version of {@link calculateRoot} which was added for compatibility with existing deployed contracts\n   */",
        "code": "calculateRootSlow(leaf: Field): Field"
    },
    {
        "comment": "/**\n   * @deprecated use `requireBetween(lower: UInt32, upper: UInt32)` which is equivalent\n   */",
        "code": "assertBetween(lower: UInt32, upper: UInt32): void"
    },
    {
        "comment": "/**\n   * @deprecated use `getAndRequireEquals()` which is equivalent\n   */",
        "code": "getAndAssertEquals(): U"
    },
    {
        "comment": "/**\n   * @deprecated use `requireEquals(value: U)` which is equivalent\n   */",
        "code": "assertEquals(value: U): void"
    },
    {
        "comment": "/**\n   * @deprecated use `requireNothing()` which is equivalent\n   */",
        "code": "assertNothing(): void"
    },
    {
        "comment": "/**\n   * @deprecated use `requireBetween(lower: U, upper: U)` which is equivalent\n   */",
        "code": "assertBetween(lower: U, upper: U): void"
    },
    {
        "comment": "/**\n   * @deprecated use {@link Scalar.from}\n   */",
        "code": "static fromBigInt(x: bigint)"
    },
    {
        "comment": "/**\n * @deprecated use `TokenId` instead of `Token.Id` and `TokenId.derive()` instead of `Token.getId()`\n */",
        "code": "class Token"
    },
    {
        "comment": "/**\n   * @deprecated use `this.account.tokenSymbol`\n   */",
        "code": "get tokenSymbol()"
    },
    {
        "comment": "/**\n   * @deprecated `.sign()` is deprecated in favor of `.requireSignature()`\n   */",
        "code": "sign(privateKey?: PrivateKey)"
    },
    {
        "comment": "/**\n   * @deprecated in favor of calling this function with a `PublicKey` as `signer`\n   */",
        "code": "static createSigned(signer: PrivateKey, tokenId?: Field): AccountUpdate"
    },
    {
        "comment": "/**\n   * Use this method to pay the account creation fee for another account (or, multiple accounts using the optional second argument).\n   *\n   * Beware that you _don't_ need to specify the account that is created!\n   * Instead, the protocol will automatically identify that accounts need to be created,\n   * and require that the net balance change of the transaction covers the account creation fee.\n   *\n   * @param feePayer the address of the account that pays the fee\n   * @param numberOfAccounts the number of new accounts to fund (default: 1)\n   * @returns they {@link AccountUpdate} for the account which pays the fee\n   */\n  static fundNewAccount(\n    feePayer: PublicKey,\n    numberOfAccounts?: number\n  ): AccountUpdate;\n  /**\n   * @deprecated Call this function with a `PublicKey` as `feePayer`, and remove the `initialBalance` option.\n   * To send an initial balance to the new account, you can use the returned account update:\n   * ```\n   * let feePayerUpdate = AccountUpdate.fundNewAccount(feePayer);\n   * feePayerUpdate.send({ to: receiverAddress, amount: initialBalance });\n   * ```\n   */\n  static fundNewAccount(\n    feePayer: PrivateKey | PublicKey,\n    options?: { initialBalance: number | string | UInt64 } | number\n  ): AccountUpdate;\n  static fundNewAccount(\n    feePayer: PrivateKey | PublicKey,\n    numberOfAccounts?: number | { initialBalance: number | string | UInt64 }\n  ) {\n    let accountUpdate = AccountUpdate.createSigned(feePayer as PrivateKey);\n    accountUpdate.label = 'AccountUpdate.fundNewAccount()';\n    let fee = Mina.accountCreationFee();\n    numberOfAccounts ??= 1;\n    if (typeof numberOfAccounts === 'number') fee = fee.mul(numberOfAccounts);\n    else fee = fee.add(UInt64.from(numberOfAccounts.initialBalance ?? 0));\n    accountUpdate.balance.subInPlace(fee);\n    return accountUpdate;\n  }\n\n  // static methods that implement Provable<AccountUpdate>\n  static sizeInFields = Types.AccountUpdate.sizeInFields;\n  static toFields = Types.AccountUpdate.toFields;\n  static toAuxiliary(a?: AccountUpdate) {\n    let aux = Types.AccountUpdate.toAuxiliary(a);\n    let children: AccountUpdate['children'] = {\n      callsType: { type: 'None' },\n      accountUpdates: [],\n    };\n    let lazyAuthorization = a && a.lazyAuthorization;\n    if (a) {\n      children.callsType = a.children.callsType;\n      children.accountUpdates = a.children.accountUpdates.map(\n        AccountUpdate.clone\n      );\n    }\n    let parent = a?.parent;\n    let id = a?.id ?? Math.random();\n    let label = a?.label ?? '';\n    return [{ lazyAuthorization, children, parent, id, label }, aux];\n  }\n  static toInput = Types.AccountUpdate.toInput;\n  static empty() {\n    return AccountUpdate.dummy();\n  }\n  static check = Types.AccountUpdate.check;\n  static fromFields(fields: Field[], [other, aux]: any[]): AccountUpdate {\n    let accountUpdate = Types.AccountUpdate.fromFields(fields, aux);\n    return Object.assign(\n      new AccountUpdate(accountUpdate.body, accountUpdate.authorization),\n      other\n    );\n  }\n\n  static witness<T>(\n    type: FlexibleProvable<T>,\n    compute: () => { accountUpdate: AccountUpdate; result: T },\n    { skipCheck = false } = {}\n  ) {\n    // construct the circuit type for a accountUpdate + other result\n    let accountUpdateType = skipCheck\n      ? { ...provable(AccountUpdate), check() {} }\n      : AccountUpdate;\n    let combinedType = provable({\n      accountUpdate: accountUpdateType,\n      result: type as any,\n    });\n    return Provable.witness(combinedType, compute);\n  }\n\n  static witnessChildren(\n    accountUpdate: AccountUpdate,\n    childLayout: AccountUpdatesLayout,\n    options?: { skipCheck: boolean }\n  ) {\n    // just witness children's hash if childLayout === null\n    if (childLayout === AccountUpdate.Layout.AnyChildren) {\n      accountUpdate.children.callsType = { type: 'Witness' };\n      return;\n    }\n    if (childLayout === AccountUpdate.Layout.NoDelegation) {\n      accountUpdate.children.callsType = { type: 'Witness' };\n      accountUpdate.body.mayUseToken.parentsOwnToken.assertFalse();\n      accountUpdate.body.mayUseToken.inheritFromParent.assertFalse();\n      return;\n    }\n    let childArray: AccountUpdatesLayout[] =\n      typeof childLayout === 'number'\n        ? Array(childLayout).fill(AccountUpdate.Layout.NoChildren)\n        : childLayout;\n    let n = childArray.length;\n    for (let i = 0; i < n; i++) {\n      accountUpdate.children.accountUpdates[i] = AccountUpdate.witnessTree(\n        provable(null),\n        childArray[i],\n        () => ({\n          accountUpdate:\n            accountUpdate.children.accountUpdates[i] ?? AccountUpdate.dummy(),\n          result: null,\n        }),\n        options\n      ).accountUpdate;\n    }\n    if (n === 0) {\n      accountUpdate.children.callsType = {\n        type: 'Equals',\n        value: CallForest.emptyHash(),\n      };\n    }\n  }\n\n  /**\n   * Like AccountUpdate.witness, but lets you specify a layout for the\n   * accountUpdate's children, which also get witnessed\n   */\n  static witnessTree<T>(\n    resultType: FlexibleProvable<T>,\n    childLayout: AccountUpdatesLayout,\n    compute: () => {\n      accountUpdate: AccountUpdate;\n      result: T;\n    },\n    options?: { skipCheck: boolean }\n  ) {\n    // witness the root accountUpdate\n    let { accountUpdate, result } = AccountUpdate.witness(\n      resultType,\n      compute,\n      options\n    );\n    // witness child account updates\n    AccountUpdate.witnessChildren(accountUpdate, childLayout, options);\n    return { accountUpdate, result };\n  }\n\n  /**\n   * Describes the children of an account update, which are laid out in a tree.\n   *\n   * The tree layout is described recursively by using a combination of `AccountUpdate.Layout.NoChildren`, `AccountUpdate.Layout.StaticChildren(...)` and `AccountUpdate.Layout.AnyChildren`.\n   * - `NoChildren` means an account update that can't have children\n   * - `AnyChildren` means an account update can have an arbitrary amount of children, which means you can't access those children in your circuit (because the circuit is static).\n   * - `StaticChildren` means the account update must have a certain static amount of children and expects as arguments a description of each of those children.\n   *   As a shortcut, you can also pass `StaticChildren` a number, which means it has that amount of children but no grandchildren.\n   *\n   * This is best understood by examples:\n   *\n   * ```ts\n   * let { NoChildren, AnyChildren, StaticChildren } = AccounUpdate.Layout;\n   *\n   * NoChildren                 // an account update with no children\n   * AnyChildren                // an account update with arbitrary children\n   * StaticChildren(NoChildren) // an account update with 1 child, which doesn't have children itself\n   * StaticChildren(1)          // shortcut for StaticChildren(NoChildren)\n   * StaticChildren(2)          // shortcut for StaticChildren(NoChildren, NoChildren)\n   * StaticChildren(0)          // equivalent to NoChildren\n   *\n   * // an update with 2 children, of which one has arbitrary children and the other has exactly 1 descendant\n   * StaticChildren(AnyChildren, StaticChildren(1))\n   * ```\n   */",
        "code": "static Layout ="
    },
    {
        "comment": "/**\n   * Verifies a proof using the public input, the proof, and the initial {@link Keypair} of the circuit.\n   * @example\n   * ```ts\n   * const keypair = await MyCircuit.generateKeypair();\n   * const proof = await MyCircuit.prove(privateInput, publicInput, keypair);\n   * const isValid = await MyCircuit.verify(publicInput, keypair.vk, proof);\n   * ```\n   */\n  static verify(\n    publicInput: any[],\n    verificationKey: VerificationKey,\n    proof: Proof\n  ) {\n    let publicInputFields = this._main.publicInputType.toFields(publicInput);\n    return prettifyStacktracePromise(\n      withThreadPool(async () =>\n        Snarky.circuit.verify(\n          MlFieldConstArray.to(publicInputFields),\n          proof.value,\n          verificationKey.value\n        )\n      )\n    );\n  }\n\n  // utility namespace, moved to `Provable`\n\n  /**\n   * @deprecated use {@link Provable.witness}\n   */",
        "code": "static witness = Provable.witness"
    },
    {
        "comment": "/**\n   * @deprecated use {@link Provable.asProver}\n   */",
        "code": "static asProver = Provable.asProver"
    },
    {
        "comment": "/**\n   * @deprecated use {@link Provable.runAndCheck}\n   */",
        "code": "static runAndCheck = Provable.runAndCheck"
    },
    {
        "comment": "/**\n   * @deprecated use {@link Provable.runUnchecked}\n   */",
        "code": "static runUnchecked = Provable.runUnchecked"
    },
    {
        "comment": "/**\n   * @deprecated use {@link Provable.constraintSystem}\n   */",
        "code": "static constraintSystem = Provable.constraintSystem"
    },
    {
        "comment": "/**\n   * @deprecated use {@link Provable.Array}\n   */",
        "code": "static array = Provable.Array"
    },
    {
        "comment": "/**\n   * @deprecated use {@link Provable.assertEqual}\n   */",
        "code": "static assertEqual = Provable.assertEqual"
    },
    {
        "comment": "/**\n   * @deprecated use {@link Provable.equal}\n   */",
        "code": "static equal = Provable.equal"
    },
    {
        "comment": "/**\n   * @deprecated use {@link Provable.if}\n   */",
        "code": "static if = Provable.if"
    },
    {
        "comment": "/**\n   * @deprecated use {@link Provable.switch}\n   */",
        "code": "static switch = Provable.switch"
    },
    {
        "comment": "/**\n   * @deprecated use {@link Provable.inProver}\n   */",
        "code": "static inProver = Provable.inProver"
    },
    {
        "comment": "/**\n   * @deprecated use {@link Provable.inCheckedComputation}\n   */",
        "code": "static inCheckedComputation = Provable.inCheckedComputation"
    },
    {
        "comment": "/**\n   * @deprecated use {@link Provable.log}\n   */",
        "code": "static log = Provable.log"
    },
    {
        "comment": "/**\n *\n * @deprecated This is deprecated in favor of {@link Mina.Network}, which is exactly the same function.\n * The name `BerkeleyQANet` was misleading because it suggested that this is specific to a particular network.\n */",
        "code": "function BerkeleyQANet(graphqlEndpoint: string)"
    },
    {
        "comment": "/**\n * @deprecated It's deprecated to pass in the fee payer's private key. Pass in the public key instead.\n * ```\n * // good\n * Mina.transaction(publicKey, ...);\n * Mina.transaction({ sender: publicKey }, ...);\n *\n * // deprecated\n * Mina.transaction(privateKey, ...);\n * Mina.transaction({ feePayerKey: privateKey }, ...);\n * ```\n */\nfunction transaction(\n  sender: DeprecatedFeePayerSpec,\n  f: () => void\n): Promise<Transaction>;\nfunction transaction(\n  senderOrF: DeprecatedFeePayerSpec | (() => void),\n  fOrUndefined?: () => void\n): Promise<Transaction> {\n  let sender: DeprecatedFeePayerSpec;\n  let f: () => void;\n  try {\n    if (fOrUndefined !== undefined) {\n      sender = senderOrF as DeprecatedFeePayerSpec;\n      f = fOrUndefined;\n    } else {\n      sender = undefined;\n      f = senderOrF as () => void;\n    }\n    return activeInstance.transaction(sender, f);\n  } catch (error) {\n    throw prettifyStacktrace(error);\n  }\n}\n\n/**\n * Returns the public key of the current transaction's sender account.\n *\n * Throws an error if not inside a transaction, or the sender wasn't passed in.\n */",
        "code": "function sender()"
    },
    {
        "comment": "/**\n   * @deprecated use `x.equals(0)` which is equivalent\n   */",
        "code": "isZero()"
    }
]