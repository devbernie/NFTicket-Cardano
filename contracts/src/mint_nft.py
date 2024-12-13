from pycardano import (
    TransactionBuilder,
    OgmiosChainContext,
    Network,
    PaymentSigningKey,
    PaymentVerificationKey,
    Address,
    MultiAsset,
    AssetName,
    Value,
    TransactionOutput,
    AuxiliaryData,
    Metadata,
    ScriptPubkey,
    ScriptAll
)
from typing import Dict


def mint_nft(event_id: str, ticket_type: str, owner_address: str, metadata: Dict):
    """
    Mint a new NFT ticket.

    Args:
        event_id (str): The ID of the event.
        ticket_type (str): The type of ticket.
        owner_address (str): The address of the ticket owner.
        metadata (Dict): The metadata for the NFT.

    Returns:
        str: The transaction ID of the minted NFT.
    """
    # Ensure metadata is valid
    if not validate_metadata(metadata):
        raise ValueError("Invalid metadata")

    # Create context for TransactionBuilder
    context = OgmiosChainContext(
        "wss://ogmios-api.testnet.dandelion.link", network=Network.TESTNET
    )

    # Generate signing and verification keys for the policy
    signing_key = PaymentSigningKey.generate()
    verification_key = PaymentVerificationKey.from_signing_key(signing_key)

    # Create a minting policy using ScriptPubkey and ScriptAll
    script_pubkey = ScriptPubkey(verification_key.hash())
    policy = ScriptAll([script_pubkey])
    policy_id = policy.hash()

    # Create the asset name
    asset_name = AssetName(f"{event_id}_{ticket_type}".encode())

    # Define the NFT asset
    nft = MultiAsset({policy_id: {asset_name: 1}})

    # Create a new TransactionBuilder
    builder = TransactionBuilder(context)

    # Add outputs (minted NFT)
    builder.add_output(
        TransactionOutput(
            Address.from_primitive(owner_address),
            Value(2000000, nft),  # 2 ADA + NFT
        )
    )

    # Add metadata
    metadata_obj = Metadata(metadata)
    auxiliary_data = AuxiliaryData(data=metadata_obj)
    builder.auxiliary_data = auxiliary_data

    # Add minting policy
    builder.mint = nft
    builder.native_scripts = [policy]

    # Build and sign transaction
    signed_tx = builder.build_and_sign(
        [signing_key], change_address=Address.from_primitive(owner_address)
    )

    # Log the metadata before submission
    print(f"Submitting transaction with metadata: {metadata}")
    
    # Submit the transaction
    tx_id = context.submit_tx(signed_tx)
    print(f"Transaction submitted: {tx_id}")
    if tx_id is None:
        print("Transaction submission failed, returned None.")

    return tx_id


def validate_metadata(metadata: Dict) -> bool:
    """
    Validate the metadata for an NFT.

    Args:
        metadata (Dict): The metadata to validate.

    Returns:
        bool: True if the metadata is valid, False otherwise.
    """
    required_fields = ["eventId", "ticketType", "ownerAddress"]
    return all(field in metadata for field in required_fields)