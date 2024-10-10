
import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class BackupService {
  // Function to manually trigger a backup
  triggerBackup() {
    const backupCommand = 'pg_dump -U postgres -d mydatabase -F c -f ./backup/mydatabase.backup';  // PostgreSQL command
    exec(backupCommand, (error, stdout, stderr) => {
      if (error) {
        console.error('Error during backup:', stderr);
        return;
      }
      console.log('Backup successful:', stdout);
    });
  }

  // Cron job to trigger automatic backup every day at 3 AM
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  handleCronBackup() {
    this.triggerBackup();
  }
}
