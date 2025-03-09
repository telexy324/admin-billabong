import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { buttonVariants } from "@/components/ui/button"
import { IconButton } from "@/components/xui/icon-button"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { KeyedMutator } from "swr"

interface ButtonGroupProps<E, U> {
    className?: string
    children: React.ReactNode
    delete: { fn: (id: E[]) => Promise<void>; id: E; mutate: KeyedMutator<U> }
}

interface BlockButtonGroupProps<E, U> {
    className?: string
    children?: React.ReactNode
    block: { fn: (id: E[]) => Promise<void>; id: E; mutate: KeyedMutator<U> }
}

export function ActionButtonGroup<E, U>({
    className,
    children,
    delete: { fn, id, mutate },
}: ButtonGroupProps<E, U>) {
    const { t } = useTranslation()
    const handleDelete = async () => {
        try {
            await fn([id])
        } catch (error: any) {
            toast(t("Error"), {
                description: error.message,
            })
        }
        await mutate()
    }

    return (
        <div className={className}>
            {children}
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <IconButton variant="destructive" icon="trash" />
                </AlertDialogTrigger>
                <AlertDialogContent className="sm:max-w-lg">
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t("ConfirmDeletion")}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t("Results.ThisOperationIsUnrecoverable")}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t("Close")}</AlertDialogCancel>
                        <AlertDialogAction
                            className={buttonVariants({ variant: "destructive" })}
                            onClick={handleDelete}
                        >
                            {t("Confirm")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export function BlockButtonGroup<E, U>({
    className,
    children,
    block: { fn, id, mutate },
}: BlockButtonGroupProps<E, U>) {
    const { t } = useTranslation()

    const handleBlock = async () => {
        try {
            await fn([id])
        } catch (error: any) {
            toast(t("Error"), {
                description: error.message,
            })
        }
        await mutate()
    }
    return (
        <div className={className}>
            {children}
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <IconButton variant="destructive" icon="ban" />
                </AlertDialogTrigger>
                <AlertDialogContent className="sm:max-w-lg">
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t("ConfirmBlock")}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t("Results.ThisOperationIsUnrecoverable")}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t("Close")}</AlertDialogCancel>
                        <AlertDialogAction
                            className={buttonVariants({ variant: "destructive" })}
                            onClick={handleBlock}
                        >
                            {t("Confirm")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
