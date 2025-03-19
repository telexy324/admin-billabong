import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { IconButton } from "@/components/xui/icon-button"
import { ModelTool } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { KeyedMutator } from "swr"
import { z } from "zod"

import { createTool, updateTool } from "@/api/tool.ts"
import { FileUploader } from "@/components/file-uploader.tsx"

interface ToolCardProps {
    data?: ModelTool
    mutate: KeyedMutator<ModelTool[]>
}

const toolFormSchema = z.object({
    name: z.string().min(1),
    summary: z.string().min(1),
    description: z.string(),
    enabled: z.boolean(),
})

export const ToolCard: React.FC<ToolCardProps> = ({ data, mutate }) => {
    const { t } = useTranslation()
    const form = useForm<z.infer<typeof toolFormSchema>>({
        resolver: zodResolver(toolFormSchema),
        defaultValues: data
            ? data: {
                name: "",
                summary: "",
                description: "",
                enabled: false,
            },
        resetOptions: {
            keepDefaultValues: false,
        },
    })

    const [open, setOpen] = useState(false)
    const [items, setItems] = useState<string[]>([])

    const onSubmit = async (values: z.infer<typeof toolFormSchema>) => {
        try {
            data?.id ? await updateTool(data.id, values) : await createTool(values)
        } catch (e) {
            console.error(e)
            toast(t("Error"), {
                description: t("Results.UnExpectedError"),
            })
            return
        }
        setOpen(false)
        await mutate()
        form.reset()
    }

    // const uploadFiles = async (files: File[]):Promise<string[]> => {
    //     let urls = [];
    //     for (const file of files) {
    //         const formData = new FormData();
    //         formData.append("file", file);
    //         const res = await fetch("/api/v1/file", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: formData
    //         })
    //     }
    // }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {data ? <IconButton variant="outline" icon="edit" /> : <IconButton icon="plus" />}
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <ScrollArea className="max-h-[calc(100dvh-5rem)] p-3">
                    <div className="items-center mx-1">
                        <DialogHeader>
                            <DialogTitle>{data ? "编辑工具" : "创建工具"}</DialogTitle>
                            <DialogDescription />
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 my-2">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>工具名</FormLabel>
                                            <FormControl>
                                                <Input placeholder="我的工具" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="summary"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>简介</FormLabel>
                                            <FormControl>
                                                <Input placeholder="这是一个工具" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>简介</FormLabel>
                                            <FormControl>
                                                <Input placeholder="这是一个工具，可以做事" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="enabled"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center space-x-2">
                                            <FormControl>
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                    <Label className="text-sm">
                                                        启用
                                                    </Label>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='image'
                                    render={({ field }) => (
                                        <div className='space-y-6'>
                                            <FormItem className='w-full'>
                                                <FormLabel>Images</FormLabel>
                                                <FormControl>
                                                    <FileUploader
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                        maxFiles={4}
                                                        maxSize={4 * 1024 * 1024}
                                                        // disabled={loading}
                                                        // progresses={progresses}
                                                        // pass the onUpload function here for direct upload
                                                        // onUpload={uploadFiles}
                                                        // disabled={isUploading}
                                                        items={items}
                                                        setItems={setItems}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        </div>
                                    )}
                                />
                                <DialogFooter className="justify-end">
                                    <DialogClose asChild>
                                        <Button type="button" className="my-2" variant="secondary">
                                            {t("Close")}
                                        </Button>
                                    </DialogClose>
                                    <Button type="submit" className="my-2">
                                        {t("Confirm")}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
