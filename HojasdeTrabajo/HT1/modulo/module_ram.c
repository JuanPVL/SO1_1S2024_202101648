#include <linux/module.h>
#include <linux/proc_fs.h>
#include <linux/sysinfo.h> // ram 
#include <linux/seq_file.h>
#include <linux/mm.h>

MODULE_LICENSE("GPL");
MODULE_AUTHOR("Juan Pedro Valle Lema");
MODULE_DESCRIPTION("Informacion de la RAM");
MODULE_VERSION("1.0");

struct sysinfo inf;

const long mbyte = 1024 * 1024;

static int escribir_a_proc(struct seq_file *file_proc, void *v)
{
    unsigned long total, used, notused;
    unsigned long porcUsed, porcNotUsed;

    si_meminfo(&inf);

    total = inf.totalram * (unsigned long long)inf.mem_unit / mbyte;
    notused = ((inf.freeram * (unsigned long long)inf.mem_unit) + (inf.bufferram * (unsigned long long)inf.mem_unit) + (inf.sharedram * (unsigned long long)inf.mem_unit)) / mbyte;
    used = total - notused;
    porcUsed = (used * 100) / total;
    porcNotUsed = 100 - porcUsed;
    seq_printf(file_proc, "{\"totalRam\": %lu, \"used\": %lu, \"free\": %lu, \"porcUsed\": %lu, \"porcNotUsed\": %lu}", total, used, notused, porcUsed, porcNotUsed);
    return 0;
}

static int abrir_aproc(struct inode *inode, struct file *file)
{
    return single_open(file, escribir_a_proc, NULL);
}
// Operaciones de Kernel Superior a 5.6
static struct proc_ops archivo_operaciones = {
    .proc_open = abrir_aproc,
    .proc_read = seq_read
};

static int __init modulo_init(void)
{
    proc_create("module_ram", 0, NULL, &archivo_operaciones);
    printk(KERN_INFO "Modulo lectura RAM montado\n");
    return 0;
}

static void __exit modulo_cleanup(void)
{
    remove_proc_entry("module_ram", NULL);
    printk(KERN_INFO "Modulo lectura RAM eliminado \n");
}

module_init(modulo_init);
module_exit(modulo_cleanup);

// ----------- sudo dmesg -C    limpia la consola
// ----------- sudo dmesg       muestra los mensajes