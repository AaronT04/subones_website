import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody
} from "@/components/ui/table"

const border = "border border-gray-400 rounded px-1"
const wrap = "whitespace-normal break-words"
const infocell = "w-full " + wrap
const numcell = "w-[40px] "

const headerText = "text-black"

export const dental_help_text = {
  inventory: (
    <Table className="w-full table-auto">
      <TableHeader>
        <TableRow>
          <TableHead className={headerText}>Code</TableHead>
          <TableHead className={headerText}>Description</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableRow>
          <TableCell className={numcell}>1</TableCell>
          <TableCell className={infocell}>Tooth alone (loose tooth) is present, without the socket.</TableCell>
        </TableRow>

        <TableRow>
          <TableCell className={numcell}>2</TableCell>
          <TableCell className={infocell}>Tooth is present and in situ or can be fit into socket.</TableCell>
        </TableRow>

        <TableRow>
          <TableCell className={numcell}>3</TableCell>
          <TableCell className={infocell}>Tooth is unerupted or partially erupted and is in situ.</TableCell>
        </TableRow>

        <TableRow>
          <TableCell className={numcell}>4</TableCell>
          <TableCell className={infocell}>
            Antemortem loss of tooth (crown); alveolus was resorbing or is fully resorbed.
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell className={numcell}>5</TableCell>
          <TableCell className={infocell}>Postmortem loss; tooth socket/crypt only.</TableCell>
        </TableRow>

        <TableRow>
          <TableCell className={numcell}>6</TableCell>
          <TableCell className={infocell}>Tooth is congenitally absent.</TableCell>
        </TableRow>

        <TableRow>
          <TableCell className={numcell}>9</TableCell>
          <TableCell className={infocell}>Unobservable, or Loss/damage of alveolus.</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),

  development: (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className={headerText}>Code</TableHead>
          <TableHead className={headerText}>Stage</TableHead>
          <TableHead className={headerText}>Symbol</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableRow><TableCell>1.</TableCell><TableCell>Initial cusp formation</TableCell><TableCell className={infocell}>Ci</TableCell></TableRow>
        <TableRow><TableCell>2.</TableCell><TableCell>Coalescence of cusps</TableCell><TableCell>Cco</TableCell></TableRow>
        <TableRow><TableCell>3.</TableCell><TableCell>Cusp outline complete</TableCell><TableCell>Coc</TableCell></TableRow>
        <TableRow><TableCell>4.</TableCell><TableCell>Crown 1/2 complete</TableCell><TableCell>Cr½</TableCell></TableRow>
        <TableRow><TableCell>5.</TableCell><TableCell>Crown 3/4 complete</TableCell><TableCell>Cr¾</TableCell></TableRow>
        <TableRow><TableCell>6.</TableCell><TableCell>Crown complete</TableCell><TableCell>Crc</TableCell></TableRow>
        <TableRow><TableCell>7.</TableCell><TableCell>Initial root formation</TableCell><TableCell>Ri</TableCell></TableRow>
        <TableRow><TableCell>8.</TableCell><TableCell>Initial cleft formation</TableCell><TableCell>Cli</TableCell></TableRow>
        <TableRow><TableCell>9.</TableCell><TableCell>Root 1/4 complete</TableCell><TableCell>R¼</TableCell></TableRow>
        <TableRow><TableCell>10.</TableCell><TableCell>Root 1/2 complete</TableCell><TableCell>R½</TableCell></TableRow>
        <TableRow><TableCell>11.</TableCell><TableCell>Root 3/4 complete</TableCell><TableCell>R¾</TableCell></TableRow>
        <TableRow><TableCell>12.</TableCell><TableCell>Root complete</TableCell><TableCell>Rc</TableCell></TableRow>
        <TableRow><TableCell>13.</TableCell><TableCell>Apex 1/2 closed</TableCell><TableCell>A½</TableCell></TableRow>
        <TableRow><TableCell>14.</TableCell><TableCell>Apex closed</TableCell><TableCell>Ac</TableCell></TableRow>
        <TableRow><TableCell>99.</TableCell><TableCell>Unobservable</TableCell><TableCell>Root broken or missing</TableCell></TableRow>
      </TableBody>
    </Table>
  )
}
