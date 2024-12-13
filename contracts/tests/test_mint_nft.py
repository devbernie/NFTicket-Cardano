import pytest
from pycardano import Address, Network
from src.mint_nft import mint_nft, validate_metadata


@pytest.fixture
def valid_test_data():
    """Fixture for valid test data."""
    return {
        "event_id": "event123",
        "ticket_type": "nft",
        "owner_address": (
            "addr_test1qp0al5v8mvwv9mzn77ls0tev3t838yp9ghvz2h2nw3m"
            "7tug4h34ce9qmxrcy8jflxkwlf4x4k84h3dyr9f8ct7k9sys6qnmjs5"
        ),
        "metadata": {
            "eventId": "event123",
            "ticketType": "nft",
            "ownerAddress": (
                "addr_test1qp0al5v8mvwv9mzn77ls0tev3t838yp9ghvz2h2nw3m"
                "7tug4h34ce9qmxrcy8jflxkwlf4x4k84h3dyr9f8ct7k9sys6qnmjs5"
            ),
            "description": "Test NFT Ticket",
            "image": "ipfs://QmTest123",
        },
    }


def test_validate_metadata_valid(valid_test_data):
    """Test metadata validation with valid data."""
    assert validate_metadata(valid_test_data["metadata"]) is True


def test_validate_metadata_invalid():
    """Test metadata validation with invalid data."""
    invalid_metadata = {
        "ticketType": "nft",  # Missing eventId and ownerAddress
    }
    assert validate_metadata(invalid_metadata) is False


def test_mint_nft_invalid_metadata(valid_test_data):
    """Test minting NFT with invalid metadata."""
    invalid_metadata = {"ticketType": "nft"}
    with pytest.raises(ValueError, match="Invalid metadata"):
        mint_nft(
            valid_test_data["event_id"],
            valid_test_data["ticket_type"],
            valid_test_data["owner_address"],
            invalid_metadata,
        )


@pytest.mark.integration
def test_mint_nft_success(valid_test_data):
    """
    Test successful NFT minting.
    
    This is an integration test that requires a connection to the Cardano testnet.
    Skip this test if running in CI/CD pipeline or without network access.
    """
    tx_id = mint_nft(
        valid_test_data["event_id"],
        valid_test_data["ticket_type"],
        valid_test_data["owner_address"],
        valid_test_data["metadata"],
    )
    assert isinstance(tx_id, str)
    assert len(tx_id) > 0  # Transaction ID should not be empty
