import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, useChainId } from 'wagmi'
import { parseEther } from 'viem'
import { DONTRACK_ABI, DONTRACK_ADDRESS } from '@/lib/contract'
import { Campaign, Association, Donation, Expense, GlobalStats } from '@/types'

// Obtenir l'adresse du contrat selon le réseau
function useContractAddress(): `0x${string}` {
  const chainId = useChainId()
  // 44787 = Alfajores, 42220 = Celo Mainnet
  const address = chainId === 42220 
    ? DONTRACK_ADDRESS.celo 
    : DONTRACK_ADDRESS.celoSepolia
  return address as `0x${string}`
}

// ============ READ HOOKS ============

export function useGlobalStats() {
  const address = useContractAddress()
  
  return useReadContract({
    address,
    abi: DONTRACK_ABI,
    functionName: 'getGlobalStats',
    query: {
      select: (data): GlobalStats => ({
          totalAssociations: data[0],
          totalCampaigns: data[1],
          totalDonations: data[2],
          totalRaisedAmount: data[3],
          commissionsCollected: data[4],
      }),
    },
  })
}

export function useCampaign(campaignId: bigint) {
  const address = useContractAddress()
  
  return useReadContract({
    address,
    abi: DONTRACK_ABI,
    functionName: 'getCampaign',
    args: [campaignId],
  })
}

export function useAssociation(associationId: bigint) {
  const address = useContractAddress()
  
  return useReadContract({
    address,
    abi: DONTRACK_ABI,
    functionName: 'getAssociation',
    args: [associationId],
  })
}

export function useAssociationByWallet(wallet?: `0x${string}`) {
  const address = useContractAddress()
  
  return useReadContract({
    address,
    abi: DONTRACK_ABI,
    functionName: 'getAssociationByWallet',
    args: wallet ? [wallet] : undefined,
    query: {
      enabled: !!wallet,
    },
  })
}

export function useAssociationCampaigns(associationId: bigint) {
  const address = useContractAddress()
  
  return useReadContract({
    address,
    abi: DONTRACK_ABI,
    functionName: 'getAssociationCampaigns',
    args: [associationId],
  })
}

export function useCampaignDonations(campaignId: bigint) {
  const address = useContractAddress()
  
  return useReadContract({
    address,
    abi: DONTRACK_ABI,
    functionName: 'getCampaignDonations',
    args: [campaignId],
  })
}

export function useCampaignExpenses(campaignId: bigint) {
  const address = useContractAddress()
  
  return useReadContract({
    address,
    abi: DONTRACK_ABI,
    functionName: 'getCampaignExpenses',
    args: [campaignId],
  })
}

export function useDonorHistory(donor?: `0x${string}`) {
  const address = useContractAddress()
  
  return useReadContract({
    address,
    abi: DONTRACK_ABI,
    functionName: 'getDonorHistory',
    args: donor ? [donor] : undefined,
    query: {
      enabled: !!donor,
    },
  })
}

export function useCampaignAvailableFunds(campaignId: bigint) {
  const address = useContractAddress()
  
  return useReadContract({
    address,
    abi: DONTRACK_ABI,
    functionName: 'getCampaignAvailableFunds',
    args: [campaignId],
  })
}

export function useRegistrationFee() {
  const address = useContractAddress()
  
  return useReadContract({
    address,
    abi: DONTRACK_ABI,
    functionName: 'registrationFee',
  })
}

// ============ WRITE HOOKS ============

export function useDonate() {
  const address = useContractAddress()
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const donate = async ({ campaignId, amount, message }: { 
    campaignId: bigint
    amount: string
    message: string 
  }) => {
    writeContract({
      address,
      abi: DONTRACK_ABI,
      functionName: 'donate',
      args: [campaignId, message],
      value: parseEther(amount),
    })
  }

  return {
    donate,
    isPending: isPending || isConfirming,
    isSuccess,
    error,
    hash,
  }
}

export function useRegisterAssociation() {
  const address = useContractAddress()
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const register = async ({ name, description, metadata, fee }: {
    name: string
    description: string
    metadata: string
    fee: bigint
  }) => {
    writeContract({
      address,
      abi: DONTRACK_ABI,
      functionName: 'registerAssociation',
      args: [name, description, metadata],
      value: fee,
    })
  }

  return {
    register,
    isPending: isPending || isConfirming,
    isSuccess,
    error,
    hash,
  }
}

export function useCreateCampaign() {
  const address = useContractAddress()
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const create = async ({ title, description, metadata, goal, duration }: {
    title: string
    description: string
    metadata: string
    goal: string
    duration: number
  }) => {
    writeContract({
      address,
      abi: DONTRACK_ABI,
      functionName: 'createCampaign',
      args: [title, description, metadata, parseEther(goal), BigInt(duration)],
    })
  }

  return {
    create,
    isPending: isPending || isConfirming,
    isSuccess,
    error,
    hash,
  }
}

export function useRecordExpense() {
  const address = useContractAddress()
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const record = async ({ campaignId, amount, description, proofHash }: {
    campaignId: bigint
    amount: string
    description: string
    proofHash: string
  }) => {
    writeContract({
      address,
      abi: DONTRACK_ABI,
      functionName: 'recordExpense',
      args: [campaignId, parseEther(amount), description, proofHash],
    })
  }

  return {
    record,
    isPending: isPending || isConfirming,
    isSuccess,
    error,
    hash,
  }
}

export function useWithdrawFunds() {
  const address = useContractAddress()
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const withdraw = async ({ campaignId, amount }: {
    campaignId: bigint
    amount: string
  }) => {
    writeContract({
      address,
      abi: DONTRACK_ABI,
      functionName: 'withdrawFunds',
      args: [campaignId, parseEther(amount)],
    })
  }

  return {
    withdraw,
    isPending: isPending || isConfirming,
    isSuccess,
    error,
    hash,
  }
}
